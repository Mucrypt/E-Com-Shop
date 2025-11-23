import { useLocalSearchParams } from 'expo-router'
import Step1Basic from '../../../components/post/wizard/step1-basic'
import Step2Photos from '../../../components/post/wizard/step2-photos'
import Step3DynamicFields from '../../../components/post/wizard/step3-dynamic-fields'
import Step4Pricing from '../../../components/post/wizard/step4-pricing'
import Step5Location from '../../../components/post/wizard/step5-location'
import Step6Review from '../../../components/post/wizard/step6-review'

const stepComponents = {
  '1': Step1Basic,
  '2': Step2Photos,
  '3': Step3DynamicFields,
  '4': Step4Pricing,
  '5': Step5Location,
  '6': Step6Review,
}

export default function WizardStepRoute() {
  const { step } = useLocalSearchParams<{ step: string }>()
  
  const StepComponent = stepComponents[step as keyof typeof stepComponents]
  
  if (!StepComponent) {
    // Return step 1 as default
    return <Step1Basic />
  }
  
  return <StepComponent />
}