import React, { useState } from 'react';
import { separateCamelCase } from "../../../helpers/StringHelpers.ts";
import { Employer } from "../../../types/employer/Employer.ts";
import { Link } from "react-router-dom";

type AboutEmployerProp = {
    employer: Employer | undefined;
}

const AboutCard = ({ title, value, link }: { title: string, value: string | undefined, link?: string }) => {
   return (
       <div
           className="mt-4 flex  shadow-md p-2 w-64 h-24 rounded-md flex-col ">
           <h4 className="text-white font-bold">{title}</h4>
           { link ?<Link className="text-blue-400" to={link??''}> {value} </Link>: <p className="text-white">{separateCamelCase(value)}</p>}
                  </div>
   )
}
const About = ({ employer }: AboutEmployerProp) => {
    const [more, setMore] = useState<boolean>(false);
    return (
        <div className=" flex flex-col py-4  mt-4">
            <h2 className="text-2xl text-white font-semibold">About the company</h2>
            <div className="flex md:gap-8 max-md:flex-col">
                <AboutCard title={"Industry"} value={employer?.industry} link={`/employers?industry=${employer?.industry}`} />
               <AboutCard title={"Founded"} value={new Date(employer?.founded ?? "").toLocaleDateString()} />
            </div>
            <div className="flex md:gap-8 max-md:flex-col">
                <AboutCard title={"Headquarters"} value={employer?.headquarters} />
                <AboutCard title={"Website"} value={employer?.website} link="google.com"/>
            </div>
            <div className="p-4 mt-8">
                <p className="text-white">{`${more?employer?.description:employer?.description.slice(0, 500)+'...'}`}
                    <span onClick={()=>setMore(!more)} className="text-sm text-blue-400 cursor-pointer">
                        {`${more ? 'Show less' : 'Show more'}`}
                    </span>
                </p>
            </div>


        </div>
    );
};

export default About;
