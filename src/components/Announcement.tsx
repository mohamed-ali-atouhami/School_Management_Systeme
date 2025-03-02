export default function Announcement() {
    return (
        <div className="bg-white rounded-md p-4 ">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Announcements</h1>
                <span className="text-xs text-gray-400">View All</span>
            </div>
            <div className="flex flex-col gap-4 mt-4">
                <div className="bg-medaliSkyLight rounded-md p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-medium">Announcement 1</h2>
                        <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1 ">2025-03-02</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">Lorem ipsum dolor sit amet</p>
                </div>
            </div>
            <div className="flex flex-col gap-4 mt-4">
                <div className="bg-medaliPurpleLight rounded-md p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-medium">Announcement 2</h2>
                        <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1 ">2025-03-02</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">Lorem ipsum dolor sit amet</p>
                </div>
            </div>
            <div className="flex flex-col gap-4 mt-4">
                <div className="bg-medaliYellowLight rounded-md p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-medium">Announcement 3</h2>
                        <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1 ">2025-03-02</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">Lorem ipsum dolor sit amet</p>
                </div>
            </div>
        </div>
    );
}
