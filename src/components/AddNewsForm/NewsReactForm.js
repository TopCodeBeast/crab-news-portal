import React from 'react'
import {Flex, FormControl, FormErrorMessage, FormLabel, Input, Textarea, useColorModeValue} from '@chakra-ui/react'
import {CRAB_CHAIN_ID} from "../../utils/Constants";
import {useStore} from "../../contexts/AuthContext";

export default function NewsReactForm({register, errors}) {
    const {chainId, address} = useStore()

    return (
        <Flex height="full"
              alignItems={'center'}
              flexDirection={'column'}>
            <FormControl borderColor={useColorModeValue('gray.500', 'gray.100')}
                         isInvalid={errors.title}>
                <FormLabel htmlFor='title'>Title</FormLabel>
                <Input id='title'
                       mb={'10px'}
                       w={[350, 450, 550]}
                       placeholder='Enter news title...'
                       disabled={(chainId !== CRAB_CHAIN_ID || !address)}
                       {...register('title', {
                           required: 'This is required',
                           minLength: {value: 3, message: 'Minimum length should be 3'},
                           maxLength: {value: 100, message: 'Maximum length should be 100'},
                       })}/>
                <FormErrorMessage>
                    {errors?.title?.message}
                </FormErrorMessage>
            </FormControl>

            <FormControl
                borderColor={useColorModeValue('gray.500', 'gray.100')}
                isInvalid={errors.body}>
                <FormLabel htmlFor='body'>Content</FormLabel>
                <Textarea id='body'
                          height={'300px'}
                          w={[350, 450, 550]}
                          placeholder='Enter news content...'
                          disabled={(chainId !== CRAB_CHAIN_ID || !address)}
                          {...register('body', {
                              required: 'This is required',
                              minLength: {value: 4, message: 'Minimum length should be 4'}
                          })}/>
                <FormErrorMessage>
                    {errors?.body?.message}
                </FormErrorMessage>
            </FormControl>
        </Flex>
    )
}
