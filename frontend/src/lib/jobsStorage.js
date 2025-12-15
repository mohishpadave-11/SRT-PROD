// Simple localStorage-based job storage utility
// This is a temporary solution until proper backend integration

const JOBS_STORAGE_KEY = 'jobs_data'

// Get all jobs from localStorage
export const getJobs = () => {
  try {
    const jobs = localStorage.getItem(JOBS_STORAGE_KEY)
    return jobs ? JSON.parse(jobs) : []
  } catch (error) {
    console.error('Error getting jobs from storage:', error)
    return []
  }
}

// Add a new job
export const addJob = (jobData) => {
  try {
    const existingJobs = getJobs()
    const newJob = {
      ...jobData,
      id: Date.now(), // Simple ID generation
      createdAt: new Date().toISOString()
    }
    
    const updatedJobs = [...existingJobs, newJob]
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(updatedJobs))
    
    return newJob
  } catch (error) {
    console.error('Error adding job to storage:', error)
    throw error
  }
}

// Update an existing job
export const updateJob = (jobId, jobData) => {
  try {
    const existingJobs = getJobs()
    const jobIndex = existingJobs.findIndex(job => job.id === jobId)
    
    if (jobIndex === -1) {
      throw new Error('Job not found')
    }
    
    existingJobs[jobIndex] = { ...existingJobs[jobIndex], ...jobData }
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(existingJobs))
    
    return existingJobs[jobIndex]
  } catch (error) {
    console.error('Error updating job in storage:', error)
    throw error
  }
}

// Delete a job
export const deleteJob = (jobId) => {
  try {
    const existingJobs = getJobs()
    const filteredJobs = existingJobs.filter(job => job.id !== jobId)
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(filteredJobs))
    
    return true
  } catch (error) {
    console.error('Error deleting job from storage:', error)
    throw error
  }
}

// Get a single job by ID
export const getJobById = (jobId) => {
  try {
    const jobs = getJobs()
    return jobs.find(job => job.id === parseInt(jobId))
  } catch (error) {
    console.error('Error getting job by ID:', error)
    return null
  }
}