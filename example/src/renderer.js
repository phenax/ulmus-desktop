export default {
  getFlags() {
    return {
      foobar: 'Renderrrr',
    }
  },

  setup(app) {
    console.log('>>>>>>>>> renderer', app)
  },
}
