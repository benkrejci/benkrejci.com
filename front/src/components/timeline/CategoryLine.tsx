import { CSSProperties, forwardRef, ReactElement } from 'react'

import { useTimelineStyles } from './styles'

export const CategoryLine = forwardRef<
  HTMLDivElement,
  {
    color: string
    style?: CSSProperties
  }
>(({ color, style }, ref): ReactElement => {
  const styles = useTimelineStyles()

  return (
    <div
      className={`${styles.verticalLineCell} ${styles.categoryLineCell}`}
      style={style}
      aria-hidden
      ref={ref}
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
})
