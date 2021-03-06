import moment from 'moment'

export const appUtils = {
	currentDate() { return moment().format('DD/MMMM/YYYY') },
	currentYear() { return moment().format('YYYY') },
	currentMonth() { return moment().format('MMMM') },
	sum(array) {
		if(!array || !array.length) return;
		return array.reduce((a, b) => a + b)
	},
	initialPayloadState() {
		return {
			items: [],
			expenses: [],
			temp: null,
			savedYear: null,
			savedMonth: null,
			currentMonth: '',
			currentYear: '',
			popin:  {
				isActiv: false,
				message: '',
				type: ''
			},
			searches: {
				categories: null,
				names: null
			}
		}
	},
	initialAuthState() {
		return {
			user: null,
			loading: false,
			error: null,
			userRequest: null
		}
	},
	localDateFr(date, format) {
		return moment(date).locale('fr').format(format)
	},
	firebaseRequest(url, data) {
		return firebase.database().ref(url).set(data)
	}
	/*reducedArray(array, key1, key2, key3, val) {
		return array.reduce( (item, next) => {
			const lastItemIndex = item.length - 1
			const itemHasContent = item.length >= 1

			if(itemHasContent && item[lastItemIndex][key1] === next[key1]) {
				item[lastItemIndex][key2] += next[key2]
			} 
			else {
				item[lastItemIndex + 1] = { [key1]: next[key1], [key2]: next[key2] }
			}

			return item
		}, [])
	}*/
}