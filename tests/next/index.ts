function mergeObjectsAndCombineValues(jsonString: string): string {
    // Parse the JSON string to an array of objects
    const objects = JSON.parse(jsonString) as Record<string, string>[]

    // Merge objects and combine values for duplicate keys
    const mergedObject = objects.reduce((acc, obj) => {
        Object.keys(obj).forEach(key => {
            // Check if the key exists in the accumulator
            if (acc[key]) {
                // Both values are arrays
                if (Array.isArray(acc[key]) && Array.isArray(obj[key])) {
                    acc[key] = [...acc[key], ...obj[key]]
                }
                // Accumulator value is an array, new value is a string
                else if (Array.isArray(acc[key]) && typeof obj[key] === "string") {
                    acc[key].push(obj[key])
                }
                // Accumulator value is a string, new value is an array
                else if (typeof acc[key] === "string" && Array.isArray(obj[key])) {
                    acc[key] = [acc[key], ...obj[key]]
                }
                // Both values are strings
                else {
                    acc[key] = `${acc[key]} ${obj[key]}`
                }
            } else {
                // Key does not exist, simply add it
                acc[key] = obj[key]
            }
        })
        return acc
    }, {})

    return JSON.stringify(mergedObject, null, 4)
}

// Example usage with the provided text
const text = `
    {
        "hover": "flex items-center justify-center"
    },
    {
        "hover": [
            "bg-red-500 text-white",
            "before:bg-red-700 before:text-white"
        ],
        "focus": "absolute inset-0",
        "active": "w-full fixed top-0"
    }
`

console.log(mergeObjectsAndCombineValues(`[${text.replace(/(\w+)(?=:)/g, '"$1"')}]`))
