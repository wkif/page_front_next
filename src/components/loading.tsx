export default function Loading(
    {
        loading
    }: {
        loading: boolean
    }
) {
    if (loading) {
        return (
            <div className="flex justify-center items-center w-1/1 h-1/1 relative left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
                <div className="animate-spin rounded-full h-[20px] w-[20px] border-b-2 border-gray-900"></div>
            </div>
        )
    }
    else {
        return <></>
    }
}