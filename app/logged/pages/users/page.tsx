import React, { FC } from 'react';

interface UsersProps {
  
}

const Users: FC<UsersProps> = ({ }) => {
  return (
    <div className='flex flex-col'>
        <p>Users</p>

        <p>My user</p>
        <p>Tu name, email, role y descripcion de tu role</p>
        <p>Roles: only articles, articles and publications, admin</p>

        <p>Users table con name, email, role, change data pop up button, delete button</p>
        <p>User delete pop up</p>
        <p>User  edit pop up, con cambio de name, email y role (dependiendo de tu rol) </p>
    </div>
  );
};

export default Users;