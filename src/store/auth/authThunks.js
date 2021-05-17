import { authAPI } from '../../api/auth/authApi'
import { setAuthUserData, watchLoading } from './authActions'
import { localStorageService } from '../../helpers/localStorageService'
import { history } from '../../helpers/history'


export const getCurrentUser = () => {
	return (dispatch) => {
		dispatch(watchLoading(true))
		authAPI.getCurrentUser()
			.then(response => {
				dispatch(setAuthUserData(response.data))
				dispatch(watchLoading(false))
			})
			.catch(error => {
				dispatch(watchLoading(false))
			})
	}
}

export const signUp = (newAccountData) => {
	return (dispatch) => {
		dispatch(watchLoading(true))
		authAPI.signUp(newAccountData)
			.then(response => {
				dispatch(watchLoading(false))
				alert(`Пользователь с ником ${response.data.username} создан!`)
				history.push('/auth/sign-in')
			})
			.catch(error => {
				dispatch(watchLoading(false))
			})
	}
}

export const signIn = (accountData) => {
	return (dispatch) => {
		dispatch(watchLoading(true))
		authAPI.signIn(accountData)
			.then(response => {
				localStorageService.setToken(response.data.token)
				dispatch(setAuthUserData({ username: response.data.username }))
				dispatch(watchLoading(false))
				history.push('/')
			})
			.catch(error => {
				if (error.response && error.response.status === 400) {
					if (error.response.data.non_field_errors) {
						alert(error.response.data.non_field_errors)
						console.log(error.response.data.non_field_errors)
					}
				}
				dispatch(watchLoading(false))
			})
	}
}


export const signOut = () => {
	return (dispatch) => {
		localStorageService.clearStorage()
		dispatch(setAuthUserData({
			id: '',
			username: '',
			photo: '',
			is_paid: false
		}))
	}
}