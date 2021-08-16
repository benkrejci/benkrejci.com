export default function handler(req, res) {
  try {
    // Clears the preview mode cookies.
    // This function accepts no arguments.
    res.clearPreviewData()

    if (req.query.returnTo) {
      return res.redirect(req.query.returnTo)
    } else {
      return res.status(200).json({ message: 'Cookies Cleared' })
    }
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}
