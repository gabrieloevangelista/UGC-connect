import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/painel/',
    },
    sitemap: 'https://ugcconnect.com.br/sitemap.xml',
  }
}
