import Image from "next/image";

const Navbar = () => {
    return (
        <div className="flex items-center justify-between p-4">
            {/*Search Bar*/}
            <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
                <Image src="/search.png" alt="search" width={14} height={14} />
                <input type="text" placeholder="Search..." className="w-[200px] p-2 bg-transparent outline-none" />
            </div>
            {/*Icons & User*/}
            <div className="flex items-center gap-6 justify-end w-full">
                <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
                    <Image src="/message.png" alt="message" width={14} height={14} />
                </div>
                <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
                    <Image src="/announcement.png" alt="announcement" width={14} height={14} />
                    <div className="absolute -top-3 -right-3 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">
                        <span className="text-xs text-white">1</span>
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm leading-3 font-medium">John Doe</span>


                    <span className="text-xs text-gray-500 text-right">Admin</span>
                </div>
                <Image src="/avatar.png" alt="avatar" width={36} height={36} className="rounded-full" />
            </div>
        </div>
    )
}

export default Navbar;