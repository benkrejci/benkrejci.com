import React, { ReactElement } from 'react'

import { Project as ProjectModel } from '../../api/api'
import { Project } from './Project'

export const ProjectList = ({ projects }: { projects: ProjectModel[] }): ReactElement => {
  return (
    <>
      {projects.map((project) => (
        <Project project={project} key={project.id} />
      ))}
    </>
  )
}
