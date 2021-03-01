import { useFormik } from 'formik'
import { ReactElement, useState } from 'react'
import * as yup from 'yup'

import {
  Box, Button, Container, Grid, InputAdornment, LinearProgress, makeStyles, Slide, Snackbar,
  TextField, Typography
} from '@material-ui/core'
import { Email, Send } from '@material-ui/icons'
import { Alert } from '@material-ui/lab'

import { submitContact } from '../../api/api'

const validationSchema = yup.object({
  email: yup.string().email('Enter a valid email address').required('Email is required'),
  name: yup.string().required('Name is required'),
  subject: yup.string().max(60, 'Subject too long').required('Subject is required'),
  message: yup.string().required('Message is required'),
})

type SubmitState = 'init' | 'pending' | 'done'

export const ContactForm = (): ReactElement => {
  const [submitState, setSubmitState] = useState<SubmitState>('init')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const formik = useFormik({
    initialValues: {
      email: '',
      name: '',
      subject: '',
      message: '',
    },
    validationSchema,
    onSubmit: (values) => {
      setSubmitState('pending')
      submitContact(values).then((response) => {
        setSubmitState('done')
        setSubmitError(response.error)
        if (!response.error) formik.resetForm()
      })
    },
  })

  const styles = useStyles()

  return (
    <Container maxWidth="md" className={styles.container}>
      <Snackbar
        open={submitState === 'done'}
        autoHideDuration={6000}
        onClose={() => setSubmitState('init')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Slide}
      >
        <Alert severity={submitError ? 'error' : 'success'} elevation={6}>
          {submitError ? `Error submitting form: ${submitError}` : 'Sent!'}
        </Alert>
      </Snackbar>
      <Box my={2}>
        <Typography variant="h2">Contact Casey</Typography>
      </Box>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="email"
              label="Email"
              required
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && !!formik.errors.email}
              helperText={formik.touched.email && formik.errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="name"
              label="Name"
              required
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && !!formik.errors.name}
              helperText={formik.touched.name && formik.errors.name}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="subject"
              label="Subject"
              required
              value={formik.values.subject}
              onChange={formik.handleChange}
              error={formik.touched.subject && !!formik.errors.subject}
              helperText={formik.touched.subject && formik.errors.subject}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="message"
              label="Message"
              required
              value={formik.values.message}
              onChange={formik.handleChange}
              error={formik.touched.message && !!formik.errors.message}
              helperText={formik.touched.message && formik.errors.message}
              variant="outlined"
              multiline
              rows={6}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              disabled={submitState === 'pending'}
              variant="contained"
              color="primary"
              size="large"
              endIcon={<Send />}
            >
              {submitState === 'pending' ? 'Sending...' : 'Send'}
            </Button>
            <Box my={2} style={{ visibility: submitState === 'pending' ? 'visible' : 'hidden' }}>
              <LinearProgress />
            </Box>
          </Grid>
        </Grid>
      </form>
    </Container>
  )
}

const useStyles = makeStyles((theme) => ({
  container: {
    paddingLeft: 0,
    paddingRight: 0,
  },
}))
