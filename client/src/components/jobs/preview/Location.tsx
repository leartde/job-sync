import { FaCar } from 'react-icons/fa6';
import { TbMapPin } from 'react-icons/tb';

type JobPreviewLocationProps = {
    address? : string;
}
const Location = ({address}:JobPreviewLocationProps) => {
    return (
        <div className='flex flex-col gap-2 p-6 border border-gray-300'>
            <h2 className='text-base font-medium'>Location</h2>
            <div className="flex flex-col">
            <div className="flex text-sm gap-2 items-center">
                <FaCar/>
                <p className='font-semibold'>Estimated commute</p>

            </div>
              <p className='text-sm'>Over an hour from <a className='text-blue-700 underline' href="">503 Robin Dr.</a></p>
            </div>

            <div className="flex flex-col">
            <div className="flex text-sm gap-2 items-center">
                <TbMapPin className='text-lg'  />
                <p className='font-semibold'>Job Address</p>

            </div>
              <p className='text-sm'>{address??"Remote"}</p>
            </div>

        </div>
    );
}

export default Location;
