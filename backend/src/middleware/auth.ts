import { getAuth } from '@clerk/express'
import type { Request, Response, NextFunction } from 'express'

export const protect = (req: Request, res: Response, next: NextFunction) => {
    const { userId } = getAuth(req)
    if (!userId) return res.status(401).json({ message: 'Unauthorized' })
    next()
}
