// Clean data storage
var cleanData = {};

// Function to clean data iteratively
function cleanDataFunction(parentObj, key) {
	var temp = {};
	if (Array.isArray(parentObj[key])) {
		parentObj[key] = parentObj[key][0];
	}
	else {
		Object.keys(parentObj).map(function(keyName, keyIndex) {
			if (typeof(parentObj[keyName]) === 'object') {
				var arr = cleanDataFunction(parentObj[keyName], keyName);
				if (Array.isArray(arr))
					temp[keyName] = arr[0];
			}
			return parentObj;
		});
	}

	if (Object.keys(temp).length)
		cleanData[key] = temp;

	return parentObj;
}

// Fucntion to convert data to clean tree fromat
function Save(data) {
	// iterate all branches
	Object.keys(data).map(function(keyName, keyIndex) {
		if (typeof(data[keyName]) === 'object') {
			var temp = cleanDataFunction(data[keyName], keyName);
			// If it is data
			if (Array.isArray(temp))
				cleanData[keyName] = temp[0];

		}
		return data[keyName];
	});

	return cleanData;
}

export default Save;