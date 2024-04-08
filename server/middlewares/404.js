export const handle404 = (req, res) => {
    res.state = 404;
    res.status(404).json({ message: `Cannot ${req.method} ${req.url}`, status: res.state })
}