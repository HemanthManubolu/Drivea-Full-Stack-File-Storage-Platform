// Get current user profile & storage info
// GET /api/auth/me
export const getMe = async (req, res) => {
    try {
        return res.status(200).json({user: req.user})
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}
