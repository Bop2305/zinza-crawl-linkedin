export const getTotalPage = (count: number, perPage: number) => {
    return count % perPage == 0
        ? Math.floor(count / perPage)
        : Math.floor(count / perPage) + 1
}