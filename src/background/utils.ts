export const wait = async (time: number) => {
    return await new Promise((resolve) => {
        setTimeout(() => {
            resolve(true)
        }, time);
    })
}