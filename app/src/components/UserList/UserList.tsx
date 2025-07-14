import React, { useState, useEffect } from 'react';
import { apiCall } from '../../utils/api';
import './UserList.css';

interface User {
  id: string;
  name: string;
}

interface UserListProps {
  onUserSelect: (userId: string) => void;
  selectedUserId?: string;
}

function UserList({ onUserSelect, selectedUserId }: UserListProps): React.JSX.Element {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await apiCall('/users');

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const usersData: User[] = await response.json();
        setUsers(usersData);

        // Auto-select first user if none is selected
        if (usersData.length > 0 && !selectedUserId) {
          onUserSelect(usersData[0].id);
        }
      } catch (error: any) {
        setErrorMessage('Failed to load users: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [onUserSelect, selectedUserId]);

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onUserSelect(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="user-list-container">
        <div className="loading-message">Loading users...</div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="user-list-container">
        <div className="error-message">{errorMessage}</div>
      </div>
    );
  }

  return (
    <div className="user-list-container">
      <select id="user-select" value={selectedUserId || ''} onChange={handleUserChange} className="user-select">
        <option value="" disabled>
          Choose a user...
        </option>
        {users.map(user => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default UserList;
