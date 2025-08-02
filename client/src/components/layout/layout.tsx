import { Outlet } from 'react-router'
import Header from '../common/header'

const Layout = () => {
  return (
    <main>
      <Header />
      <Outlet />
    </main>
  )
}

export default Layout