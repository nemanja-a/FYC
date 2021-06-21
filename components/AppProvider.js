import { createContext, useContext } from 'react'

// Create Context object.
const AppContext = createContext()

// Export Provider.
export function AppProvider(props) {
	const {value, children} = props
	
	return (
	   <AppContext.Provider value={value}>
		{children}
	   </AppContext.Provider>
	)
}

// Export useContext Hook.
export function useAppContext() {
	return useContext(AppContext);
}