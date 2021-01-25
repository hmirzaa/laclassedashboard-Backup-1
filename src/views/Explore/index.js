import React, { Fragment, useEffect, useState } from 'react';
import { Container } from '@material-ui/core';
import { capitalizeCase } from '../../utils/commanFun'
import Page from 'src/components/Page';

import PublicCourses from '../../views/Explore/PublicCourses';
import Categories from '../../views/Explore/Categories';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import LoadingElement from '../Loading/LoadingElement';
import EmptyElements from '../Empty/EmptyElements';
import { useHistory } from 'react-router';
import { LocalStorage } from '../../services/localstorage.service';


import * as API from '../../services2';

export default function Explore() {
  const { t } = useTranslation();
  const token = useSelector(state => state.user.token);

  const [categories, setCategories] = useState([]) 
  const [publicRooms, setPublicRooms] = useState([]) 
  const [pagePublic, setPagePublic] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingBtn, setIsLoadingBtn] = useState(true)
  const [IsAuth, setIsAuth] = useState(true);
  const history = useHistory();

  useEffect(() => {
   

      const userToken = LocalStorage.getItem('userToken');
  
      if (!userToken || userToken === '') {
        setIsAuth(false)
      }else{
        setIsAuth(true)
        
      }
      getCategory()
      getAllPublicRooms()
      setIsLoading(true)

      

  }, [IsAuth])

  const getCategory = () => {
    IsAuth ?(
    API.getCategory(token).then((res) => {
      const {data: { categories }, status } = res
      if (status !== 1) return
        setIsLoading(false) 
        setCategories(categories)
    }))
    :(
    API.getCategoryWithoutAuth().then((res) => {
      const {data: { categories }, status } = res
      if (status !== 1) return
        setIsLoading(false) 
        setCategories(categories)
    })
    )}

  const getAllPublicRooms = () => {
    
    
    IsAuth ? (
      API.getAllPublicRooms(token).then((res) => {
        const {data, status } = res
        if (status !== 1) return
          let courseArray = res.data
          courseArray.map((courses) =>{
              if(courses.isActive==true)
              {
                if(courses.creator==null)
                  {
                    API.deleteCourseWithoutTeacher(courses._id)
                    setIsLoading(true) 
                  }
              }

          });

     
          setPublicRooms(capitalizeCase(data))
          setIsLoading(false) 
          
        
    })
    ):(
      API.getAllPublicRoomsWithoutAuth().then((res) => {
        const {data: { results }, status } = res
        if (status !== 1) return
          let courseArray = res.data.results
          courseArray.map((courses) =>{
              if(courses.isActive==true)
              {
                if(courses.creator==null)
                  {
                    API.deleteCourseWithoutTeacher(courses._id)
                    setIsLoading(true) 
                  }
              }

          });

          
          setIsLoading(false) 
          setPublicRooms(capitalizeCase(results))
        
    }))

        
  }

  const getAllPublicRoomsByCategory = (categoryId) => {
    setIsLoading(true)
    IsAuth ? (
      API.getAllPublicRoomsByCategory(categoryId,token).then((res) => {
        const {data: { results }, status } = res
        if (status !== 1) return
          setIsLoading(false) 
          setPublicRooms(capitalizeCase(results))
          setIsLoading(false)
    })):(
      API.getAllPublicRoomsByCategoryWithoutAuth(categoryId).then((res) => {
        const {data: { results }, status } = res
        if (status !== 1) return
          setIsLoading(false) 
          setPublicRooms(capitalizeCase(results))
          setIsLoading(false)
      }))
  }


  return (
    <Fragment>
    <>
      <Page
        titleHeading="Default"
        titleDescription="This is a Explore page example built using this template."
      />
       <Container maxWidth="lg">
     
          <Categories 
            theCategory={categories}
            getCategoryIdFun={getAllPublicRoomsByCategory}
          />
            {
        isLoading ? <LoadingElement /> 
        :   
         publicRooms.length > 0 ? 
        <>
          <PublicCourses
            getAllPublicRooms={getAllPublicRooms} 
            publicRooms={publicRooms}
          />
        </>
          :   
           <EmptyElements title={t('No Courses')} />
       }
      </Container>
    </> 
    </Fragment>
  );
}
