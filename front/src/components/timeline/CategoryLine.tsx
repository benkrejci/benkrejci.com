import { ReactElement } from 'react'

import { CSSProperties } from '@material-ui/core/styles/withStyles'

import { useTimelineStyles } from './styles'

export const CategoryLine = ({
  color,
  style,
}: {
  color: string
  style?: CSSProperties
}): ReactElement => {
  const styles = useTimelineStyles()

  return (
    <div
      className={`${styles.verticalLineCell} ${styles.categoryLineCell}`}
      style={style}
      aria-hidden
    >
      <div
        className={`${styles.verticalLine} ${styles.verticalLineCap}`}
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${color} 100%)`,
        }}
      />
      <div className={styles.verticalLine} style={{ backgroundColor: color }} />
      <div
        className={`${styles.verticalLine} ${styles.verticalLineCap}`}
        style={{
          background: `linear-gradient(180deg, ${color} 0%, transparent 100%)`,
        }}
      />
    </div>
  )
}
