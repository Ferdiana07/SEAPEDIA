import api from './api'

const applicationReviewService = {
  getAll: async (params = {}) => (await api.get('/application-reviews', { params })).data,
  create: async (data) => (await api.post('/application-reviews', data)).data,
}

export default applicationReviewService
