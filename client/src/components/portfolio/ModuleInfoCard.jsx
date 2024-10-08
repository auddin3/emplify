import React from 'react'
import { Box, Card, CardHeader, CardBody, Tag, Stack, StackDivider, Checkbox,
  Table, TableContainer, TableCaption, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react'
import { camelCaseToSpaced } from '../../utils'
import PieChart from '../charts/PieChart'

const ModuleInfoCard = ({ module, performance }) => {
  const calculateTotal = () => {
    return performance?.grades?.reduce((total, g) => {
      const weight = module?.assessmentBreakdown?.find(a => a.title === g.activity)?.percentage ?? 0
      const grade = g?.grade ?? 0
      return total + Math.round(grade * weight * 100)
    }, 0)
  }

  return (
    <Card>
      <CardHeader backgroundColor={'#F8F9FD'} className="flex flex-row items-center space-x-3">
        <div className='text-black-custom1 text-lg font-sansSemibold leading-tight pl-2'>{module?.title}</div>
        <Tag backgroundColor='rgba(75, 117, 255, 0.2)' paddingX={2.5} borderRadius={7}>
          <div className='text-blue-kpmgBlue'>{camelCaseToSpaced(module?.category)}</div>
        </Tag>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />}>
          <Box className='px-3 pb-4'>
            <div className='font-sansSemibold pb-2'>Learning Objectives</div>
            <ul className='list-inside pl-1.5 space-y-0.5 mb-2'>
              {module?.learningObjectives?.map((lo, idx) => (
                <li key={idx} className="flex items-center font-sans">
                  <Checkbox colorScheme='green' size="sm">
                    {lo}
                  </Checkbox>
                </li>
              ))}
            </ul>
          </Box>
          <Box className='px-3 py-4'>
            <div className='font-sansSemibold pb-2'>Assessment Breakdown</div>
            {module?.assessmentBreakdown && <PieChart data={module?.assessmentBreakdown}/>}
            <TableContainer className='mt-8' tabIndex={0}>
              <Table variant='simple' size='sm'>
                <TableCaption>Results for {module?.title}</TableCaption>
                <Thead>
                  <Tr>
                    <Th>Activity</Th>
                    <Th>Weight(%)</Th>
                    <Th>Grade(%)</Th>
                    <Th>Total(%)</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {performance?.grades?.map((g, idx) => {
                    const weight = module?.assessmentBreakdown?.find(a => a.title === g.activity)?.percentage ?? 0

                    return (
                      <Tr key={idx}>
                        <Td noOfLines={4} style={{ maxWidth: '20rem', wordWrap: 'break-word', whiteSpace: 'initial' }}>
                          {g.activity}
                        </Td>
                        <Td>
                          <div className='w-fit mx-auto'>{weight * 100}</div>
                        </Td>
                        <Td>
                          <div className='w-fit mx-auto'>{Math.round(g?.grade * 100)}</div>
                        </Td>
                        <Td>
                          <div className='w-fit mx-auto'>{Math.round(g.grade * weight * 100)}</div>
                        </Td>
                      </Tr>
                    )
                  })}
                  <Tr>
                    <Td colSpan={3}></Td>
                    <Td>
                      <div className='w-fit mx-auto font-sansSemibold text-lg'>{calculateTotal()}</div>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  )
}

export default ModuleInfoCard
