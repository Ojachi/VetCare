import React from 'react';
import Button from '../../components/ui/Button';
import { useSession } from '../../context/SessionContext';

interface LogoutButtonProps {
  style?: any;
}

export default function LogoutButton(style: LogoutButtonProps) {
  const { logout } = useSession();

  return <Button title="Cerrar sesión" onPress={logout} style={style?.style} />;
}