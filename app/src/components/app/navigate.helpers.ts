import { useLocation, useNavigate } from 'react-router-dom'

import { AbsoluteRoutes } from '../../route.names'

export const useNavigateHelpers = () => {
  const location = useLocation()
  const navigate = useNavigate()

  console.log('location', location.key)

  const backToProject = (projectId?: number) => {
    if (projectId) {
      navigate(AbsoluteRoutes.ProjectHome(projectId.toString()))
    } else {
      navigate(AbsoluteRoutes.App)
    }
  }

  return { backToProject, navigate }
}
