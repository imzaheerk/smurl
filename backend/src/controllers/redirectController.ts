import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import geoip from 'geoip-lite';
import { env } from '../config/env';
import { findUserIdByHost, normalizeDomain } from '../services/customDomainService';
import { getOriginalUrl, incrementClickAndTrack } from '../services/urlService';

export async function redirectRoutes(app: FastifyInstance) {
  app.get(
    '/:shortCode',
    {
      schema: {
        tags: ['Redirect'],
        params: {
          type: 'object',
          required: ['shortCode'],
          properties: {
            shortCode: { type: 'string' }
          }
        }
      }
    },
    async (request: FastifyRequest<{ Params: { shortCode: string } }>, reply: FastifyReply) => {
      const { shortCode } = request.params;
      const hostHeader = (request.headers.host as string) ?? '';
      const requestHost = normalizeDomain(hostHeader);
      const isDefaultHost = requestHost === env.defaultRedirectHost;
      const customUserId = isDefaultHost ? null : await findUserIdByHost(hostHeader);

      const originalUrl = await getOriginalUrl(shortCode, customUserId ?? undefined);
      if (!originalUrl) {
        reply.code(404).send({ message: 'URL not found or expired' });
        return;
      }

      const ip =
        (request.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ??
        request.ip;
      const ua = request.headers['user-agent'] as string | undefined;
      const referrer = request.headers.referer as string | undefined;
      // geoip-lite returns null for localhost (127.0.0.1, ::1) and other private IPs
      const geo = ip ? geoip.lookup(ip) : null;
      const country = geo?.country ?? (ip ? 'Local' : undefined);

      let browser: string | undefined;
      if (ua) {
        if (ua.includes('Edg/') || ua.includes('Edge')) browser = 'Edge';
        else if (ua.includes('OPR') || ua.includes('Opera')) browser = 'Opera';
        else if (ua.includes('Firefox')) browser = 'Firefox';
        else if (ua.includes('Chrome')) browser = 'Chrome';
        else if (ua.includes('Safari')) browser = 'Safari';
        else browser = 'Other';
      }

      await incrementClickAndTrack(shortCode, {
        ipAddress: ip,
        userAgent: ua,
        referrer,
        country,
        browser
      }, customUserId ?? undefined);

      reply.redirect(originalUrl);
    }
  );
}

