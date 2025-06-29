import React, {  useEffect, useState } from 'react';
import FetchUsers, { UserParameters } from "../../services/admin/FetchUsers.ts";

import { User } from "../../types/authentication/User.ts";
import DashboardTable from "./DashboardTable.tsx";
import { ResponseHeaders } from "../../types/ResponseHeaders.ts";
import { Link, useSearchParams } from "react-router-dom";
import Pagination from "../shared/Pagination.tsx";
import SearchBar from "../shared/SearchBar.tsx";
import DeleteUser from "../../services/admin/DeleteUser.ts";
import { toast } from "react-toastify";
import DeleteModal from "../shared/DeleteModal.tsx";

type ButtonsProps = {
  onDeleteClick:  ()=> void;
  viewLink: string;
}


const Buttons = ({onDeleteClick, viewLink}:ButtonsProps)=>{
  return (
    <div className="flex items-center gap-2">
      <Link to={viewLink}
              className="bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
        View
      </Link>
      <button type="button" onClick={onDeleteClick}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">
        Delete
      </button>
    </div>
  )
}
const UsersDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [responseHeaders, setResponseHeaders] = useState<ResponseHeaders>({
  TotalCount: 0,
  PageSize: 10,
  CurrentPage: 1,
  TotalPages: 0,
  HasPrevious: false,
  HasNext: false
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [userParameters, setUserParameters] = useState<UserParameters>({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [userToBeDeleted, setUserToBeDeleted] = useState("");
useEffect(() => {
  setUserParameters({
    Role: searchParams.get('role'),
    PageNumber: searchParams.get('pageNumber') ? parseInt(searchParams.get('pageNumber')!) : 1,
    SearchTerm: searchParams.get('searchTerm'),
    PageSize: searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize')!) : 10
  })
}, [searchParams]);

  useEffect(() => {
    const getUsers = async () => {
      const res = await FetchUsers(userParameters);
      setUsers(res.users.filter(user => user.role !== "Admin"));
      setResponseHeaders(res.headers);
    };
    getUsers().then();
  }, [userParameters]);

  const deleteUser = async (userId: string) => {
    const res = await DeleteUser(userId);
    if(res.status === 200){
      setUsers((prevUsers) => prevUsers.filter(user => user.id !== userId));
      toast.success("User deleted successfully");
    }
  }



  return (
    <div className="w-[90%] flex flex-col gap-4 items-center shadow-md rounded-md">
      {openDeleteModal && <DeleteModal
        title="Delete User"
        paragraph="Are you sure you want to delete this user?"
        onDelete={() => {
           deleteUser(userToBeDeleted).then();
          setOpenDeleteModal(false);
        }}
        onCancel={() => {
          setOpenDeleteModal(false);
          setUserToBeDeleted("");
        }}
      />}
        <SearchBar placeholder="Search by email" updateParameters={
          (searchTerm) => {
            setSearchParams((prev) => ({
              ...prev,
              SearchTerm: searchTerm,
              PageNumber: 1
            }));
          }}/>

      <div className="w-full overflow-x-auto">
        <DashboardTable
          headers={["ID", "Email", "Role", "Actions"]}
          rows={users.map((user) => [
            user.id.toString(),
            user.email,
            user.role,
            <Buttons
              viewLink={`/admin/users/${user.id}`}
              onDeleteClick={()=> {
              setOpenDeleteModal(true);
              setUserToBeDeleted(user.id);
            }}/>,
          ])}
        />
      </div>


        <Pagination headers={responseHeaders} updateParameters={
          (pageNumber) => {
            setSearchParams((prev) => ({
              ...prev,
              PageNumber: pageNumber.PageNumber
            }));
          }}
        />
    </div>

  );
};

export default UsersDashboard;
