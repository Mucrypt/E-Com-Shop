import { useLocalSearchParams } from 'expo-router'
import SellCategory from '../../../components/post/category/sell'
import ServiceCategory from '../../../components/post/category/service'
import JobCategory from '../../../components/post/category/job'
import MediaCategory from '../../../components/post/category/media'
import RealEstateCategory from '../../../components/post/category/realestate'
import TravelCategory from '../../../components/post/category/travel'
import CourseCategory from '../../../components/post/category/course'

const categoryComponents = {
  sell: SellCategory,
  service: ServiceCategory,
  job: JobCategory,
  media: MediaCategory,
  realestate: RealEstateCategory,
  travel: TravelCategory,
  course: CourseCategory,
}

export default function CategoryRoute() {
  const { id } = useLocalSearchParams<{ id: string }>()
  
  const CategoryComponent = categoryComponents[id as keyof typeof categoryComponents]
  
  if (!CategoryComponent) {
    // Return a default component or redirect
    return <SellCategory />
  }
  
  return <CategoryComponent />
}