import { createSlice, current } from '@reduxjs/toolkit'

const excelDataSlice = createSlice({
  name: 'excelData',
  initialState: {
    data: [],
    name: ''
  },
  reducers: {
    showExcelDetail: (state, action) => {
      const { payload } = action
      state.data = payload.data
      state.name = payload.name
    //   console.log(initialState.name);
      // console.log(state.data);
      
    }
  }
})

export const { showExcelDetail } = excelDataSlice.actions
export default excelDataSlice.reducer
