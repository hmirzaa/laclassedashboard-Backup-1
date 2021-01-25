export { 
  sortByDateDescOrder,
  capitalizeCase,
  PrivetCourseCapitalizeCase
}
 
function sortByDateDescOrder (data) {
    const sortedData = data.sort((a, b) => {
      console.log(a)
      return b.updatedAt - a.updatedAt
    })
    return sortedData
  }

  const capitalizeCase = (courses) => {
    const resultCourses =  courses.map((course) => {
       course.roomName = course.roomName.slice(0,1).toUpperCase() + course.roomName.slice(1).toLowerCase()
       course.creator.fullName = course?.creator.fullName.slice(0,1).toUpperCase() + course?.creator.fullName.slice(1).toLowerCase()
       if(course?.category){course.category.name = course?.category.name .slice(0,1).toUpperCase() + course?.category?.name.slice(1).toLowerCase()}
       return course
     })
     return resultCourses
   }

  const PrivetCourseCapitalizeCase = (courses) => {
    const resultCourses =  courses.map((course) => {
       course.roomName = course.roomName.slice(0,1).toUpperCase() + course.roomName.slice(1).toLowerCase()
       course.creator.fullName = course.creator.fullName.slice(0,1).toUpperCase() + course.creator.fullName.slice(1).toLowerCase()
       return course
     })
     return resultCourses
   }