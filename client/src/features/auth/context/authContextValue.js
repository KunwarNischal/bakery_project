import { createContext } from 'react';

/**
 * Authentication Context
 * Should not be exported from a component file (React Fast Refresh rule)
 * This file only exports the context object
 */
export const AuthContext = createContext(null);
