import { getPage } from "../../src/api/api"

// Copied from https://nextjs.org/docs/advanced-features/preview-mode
export default async (req, res) => {
  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (req.query.secret !== process.env.SECRET || !req.query.id || !req.query.contentType) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  if (req.query.contentType !== 'page') {
    return res.status(400).json({ message: `Preview not available for content type ${req.query.contentType}` })
  }

  // Fetch the headless CMS to check if the provided `slug` exists
  // getPostBySlug would implement the required fetching logic to the headless CMS
  const page = await getPage({ id: req.query.id })

  // If the slug doesn't exist prevent preview mode from being enabled
  if (!page) {
    return res.status(401).json({ message: 'Invalid id' })
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({})

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  res.redirect(`/${page.data.slug === 'home' ? '' : page.data.slug}`)
}
