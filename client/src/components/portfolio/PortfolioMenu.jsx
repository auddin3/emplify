import React, { useState, useEffect } from 'react'
import { Avatar, Button, Box, Card, CardBody, Checkbox, CheckboxGroup, Input, Textarea, Stack, Stepper, Step, StepIndicator, StepStatus,
  StepSeparator, StepIcon, StepNumber, StepTitle, StepDescription, useSteps, useToast } from '@chakra-ui/react'
import Sidebar from '../Sidebar'

const PortfolioMenu = ({ isOpen, onClose, portfolio, setPortfolio, setPortfolioList, user }) => {
  const [skills, setSkills] = useState()
  const [users, setUsers] = useState()

  const [modifiedPortfolio, setModifiedPortfolio] = useState(portfolio)
  const toast = useToast()

  const fetchData = async () => {
    const skillsApiUrl = 'http://localhost:5001/skills'
    const usersApiUrl = 'http://localhost:5001/users'

    try {
      const [skillsResponse, usersResponse] = await Promise.all([
        fetch(skillsApiUrl, { method: 'GET', headers: { 'Content-Type': 'application/json' } }),
        fetch(usersApiUrl, { method: 'GET', headers: { 'Content-Type': 'application/json' } }),
      ])

      if (!skillsResponse.ok) {
        const errorData = await skillsResponse.json()
        console.error('Operation failed:', errorData)
      }

      if (!usersResponse.ok) {
        const errorData = await usersResponse.json()
        console.error('Operation failed:', errorData)
      }

      const [skillsData, usersData] = await Promise.all([
        skillsResponse.json(),
        usersResponse.json(),
      ])

      setSkills(skillsData?.skills.sort((a, b) => a.title.localeCompare(b.title)))
      setUsers(usersData?.users)
    } catch (error) {
      console.error('Operation failed:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleChange = (key, value) => {
    setModifiedPortfolio({ ...modifiedPortfolio, [key]: value })
  }

  const handleSubmit = async () => {
    const { _id, ...formattedPortfolio } = modifiedPortfolio
    const apiUrl = `http://localhost:5001/portfolio/${_id}`
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedPortfolio),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Operation failed:', errorData)
      }

      const data = await response.json()
      setPortfolio(data?.portfolio)
      setModifiedPortfolio(data?.portfolio)
      toast({
        title: 'Record Updated',
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'bottom-right',
      })
    } catch (error) {
      console.error('Operation failed:', error)
      toast({
        title: 'Changes Unsaved',
        status: 'error',
        isClosable: true,
        duration: 9000,
        position: 'bottom-right',
      })
    } finally {
      onClose()
    }
  }

  const handleCreate = async () => {
    const apiUrl = `http://localhost:5001/portfolio/${user}`
    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modifiedPortfolio),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Operation failed:', errorData)
      }

      const data = await response.json()
      setPortfolioList(data?.portfolios)
      toast({
        title: 'Record Inserted',
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'bottom-right',
      })
    } catch (error) {
      console.error('Operation failed:', error)
      toast({
        title: 'Changes Unsaved',
        status: 'error',
        isClosable: true,
        duration: 9000,
        position: 'bottom-right',
      })
    } finally {
      onClose()
    }
  }

  useEffect(() => {
    setModifiedPortfolio(portfolio)
  }, [portfolio])

  const steps = [
    { title: 'First', description: 'Basic Information' },
    { title: 'Second', description: 'Specification' },
  ]

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  })

  return (
    <Sidebar
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={`${portfolio ? 'Edit' : 'Add'} Portfolio`}
    >
      <div className='mx-20 my-10'>
        <Stepper size='md' index={activeStep}>
          {steps.map((step, index) => (
            <Step key={index}
              onClick={() => setActiveStep(index)}
            >
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>

              <Box flexShrink='0'>
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </Box>

              <StepSeparator />
            </Step>
          ))}
        </Stepper>
      </div>
      {activeStep === 0
        ? (
          <>
            <div className='px-12 py-4 space-y-3'>
              <div className='text-lg font-sansSemibold text-black-custom1'>
            Name
              </div>
              <div className='mx-1'>
                <Input
                  size="sm"
                  value={modifiedPortfolio?.name}
                  rows={9}
                  onChange={e => handleChange('name', e?.target?.value)}
                  py='1rem'
                  _placeholder={{ opacity: 1, color: 'gray.500', fontSize: 14 }}
                />
              </div>
            </div>
            <div className='px-12 py-4 space-y-3'>
              <div className='text-lg font-sansSemibold text-black-custom1'>
             Description
              </div>
              <div className='mx-1'>
                <Textarea
                  size="sm"
                  value={modifiedPortfolio?.description}
                  rows={3}
                  onChange={e => handleChange('description', e?.target?.value)}
                />
              </div>
            </div>
            <div className='px-12 py-4 space-y-8 mb-8'>
              <div className='text-lg font-sansSemibold text-black-custom1'>
                {portfolio ? 'Shared With' : 'Share With'}
              </div>
              <div className='mx-1 flex flex-row space-x-4 items-center'>
                {
                  portfolio
                    ? (
                      users?.filter(user => portfolio?.sharedWith.includes(user._id)).map(user => (
                        <Avatar key={user._id} name={user?.name} size='lg' fontWeight={600} className='cursor-pointer'/>
                      )))
                    : (
                      <div className='flex flex-col space-y-4 ml-5'>
                        {users?.map(user => (
                          <Checkbox
                            key={user._id}
                            variant="blue"
                            size="md"
                            value={user._id}
                            onChange={(e) => {
                              const checked = e.target.checked
                              if (checked) {
                                setModifiedPortfolio({
                                  ...modifiedPortfolio,
                                  sharedWith: modifiedPortfolio?.sharedWith
                                    ? modifiedPortfolio?.sharedWith?.concat(e.target.value)
                                    : [e.target.value],
                                })
                              } else {
                                setModifiedPortfolio({
                                  ...modifiedPortfolio,
                                  sharedWith: modifiedPortfolio?.sharedWith
                                    ? modifiedPortfolio?.sharedWith.filter(value => value !== e.target.value)
                                    : [],
                                })
                              }
                            }}
                          >
                            {user.name}
                          </Checkbox>
                        ))}
                      </div>
                    )
                }
              </div>
            </div>
            {!portfolio &&
            <div className='px-12 py-4 space-y-8 mb-8'>
              <div className='text-lg font-sansSemibold text-black-custom1'>
                Deadline
              </div>
              <Input
                placeholder='Select Date'
                size='md'
                type='date'
                value={modifiedPortfolio?.deadline}
                onChange={e => handleChange('deadline', e?.target?.value)}
              />
            </div>
            }
          </>
        )
        : (
          <>
            <div className='px-12 py-4 space-y-3 h-2/3 overflow-y-scroll'>
              <div className='text-lg font-sansSemibold text-black-custom1'>
            Specification
              </div>
              <CheckboxGroup defaultValue={modifiedPortfolio?.specification}>
                <Stack pl={2} mt={1} spacing={1} gap={5}>
                  {skills?.map((skill) => {
                    return (
                      <>
                        <Card key={skill._id} className='bg-gray-paleGray w-full border rounded-xl space-x-4'>
                          <CardBody className='flex flex-row space-x-5'>
                            <Checkbox
                              size='lg'
                              key={skill._id}
                              value={skill?.title}
                              onChange={(e) => {
                                const checked = e.target.checked
                                if (checked) {
                                  setModifiedPortfolio({
                                    ...modifiedPortfolio,
                                    specification: modifiedPortfolio?.specification
                                      ? modifiedPortfolio?.specification?.concat(e.target.value)
                                      : [e.target.value],
                                  })
                                } else {
                                  setModifiedPortfolio({
                                    ...modifiedPortfolio,
                                    specification: modifiedPortfolio?.specification
                                      ? modifiedPortfolio?.specification.filter(value => value !== e.target.value)
                                      : [],
                                  })
                                }
                              }}
                            >
                            </Checkbox>
                            <div>
                              <div className='font-sansSemibold'>{skill?.subTitle}</div>
                              <div className='font-sans text-black-custom1/70 text-sm'>{skill?.description.substring(0, 450)}...</div>
                            </div>
                          </CardBody>
                        </Card>
                      </>
                    )
                  },
                  )}
                </Stack>
              </CheckboxGroup>
            </div>
          </>
        )}
      <div className='w-full flex flex-row justify-center my-2'>
        <Button
          size="lg"
          bgColor='#00338D'
          color='white'
          borderRadius={99}
          className='w-1/4 py-6 my-6 mx-auto'
          onClick={portfolio ? handleSubmit : handleCreate }
        >
                Save
        </Button>
      </div>
    </Sidebar>
  )
}

export default PortfolioMenu
