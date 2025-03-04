import Google from '@/assets/google-logo.svg'

interface GoogleButtonProps {
    onClick: () => Promise<void>
    loading: boolean
    disabled?: boolean
}

export default function GoogleButton({
    onClick,
    loading,
    disabled,
}: GoogleButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={loading || disabled}
            className="w-full rounded-md flex items-center justify-center bg-gray-200 border-gray-300 border"
        >
            <div className="flex flex-row space-x-1 items-center justify-center text-center py-2">
                <Google className="w-6 h-6" />
                <p className="my-auto text-black">Google</p>
            </div>
        </button>
    )
}
