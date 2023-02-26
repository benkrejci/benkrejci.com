import React, { ReactElement } from 'react'

import { Project as ProjectModel } from '../../api/api'
import { Project } from './Project'

export const ProjectList = ({ projects }: { projects: ProjectModel[] }): ReactElement => (
  <>
    {projects
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .map((project) => (
        <Project project={project} key={project.id} />
      ))}
  </>
)
