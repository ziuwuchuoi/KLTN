import { TbUpload } from "react-icons/tb";

interface CustomUploadBoxProps {
    fileType?: string;
    fileName?: string;
    type?: string;
}

const CustomUploadBox = ({ fileType, fileName, type }: CustomUploadBoxProps) => {
    return (
        <div className="w-full h-40 rounded-lg border border-dashed border-gray-600 bg-gradient-to-b from-zinc-900 to-zinc-950 hover:border-blue-500 transition-all flex flex-col items-center justify-center cursor-pointer text-center px-4 py-6">
            <TbUpload className="text-4xl text-gray-400 mb-3" />
            {fileName ? (
                <>
                    <p className="w-full text-white font-semibold truncate">{fileName}</p>
                    <p className="text-sm text-gray-400 mt-1">Click to replace the file</p>
                </>
            ) : (
                <>
                    <p className="text-white font-semibold">
                        <span className="text-blue-500">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                        Upload your {fileType} ({type})
                    </p>
                </>
            )}
        </div>
    );
};

export default CustomUploadBox;
