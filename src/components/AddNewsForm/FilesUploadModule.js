import React, {useRef} from "react";
import {Box, Button, Flex, IconButton, Image, SimpleGrid, Text, useColorModeValue} from "@chakra-ui/react";
import {DeleteIcon} from "@chakra-ui/icons";
import {DEFAULT_MAX_FILE_SIZE_IN_BYTES,} from "../../utils/Constants";
import {convertBytesToKB, convertNestedObjectToArray} from "../../utils/handlers";
import styled from 'styled-components'

const FilesUploadModule = (
    {files, setFiles, updateFilesCb, maxFileSizeInBytes = DEFAULT_MAX_FILE_SIZE_IN_BYTES,}
) => {
    const fileInputField = useRef(null);

    const handleUploadBtnClick = () => fileInputField.current.click();

    const addNewFiles = (newFiles) => {
        for (let file of newFiles)
            if (file.size <= maxFileSizeInBytes)
                files[file.name] = file;
        return {...files};
    };

    const callUpdateFilesCb = (files) => {
        const filesAsArray = convertNestedObjectToArray(files);
        updateFilesCb(filesAsArray);
    };

    const handleNewFileUpload = (e) => {
        const {files: newFiles} = e.target;
        if (newFiles.length) {
            let updatedFiles = addNewFiles(newFiles);
            setFiles(updatedFiles);
            callUpdateFilesCb(updatedFiles);
        }
    };

    const removeFile = (fileName) => {
        delete files[fileName];
        setFiles({...files});
        callUpdateFilesCb({...files});
    };

    return (
        <Flex margin={'0px'}
              alignItems={'center'}
              flexDirection={'column'}>
            <FileUploadContainer borderColor={useColorModeValue('gray.900', 'gray.700')}>
                <Box>Drag and drop your files anywhere</Box>
                <Button zIndex={11}
                        type={"button"}
                        cursor={'pointer'}
                        onClick={handleUploadBtnClick}
                        rightIcon={<i className="fas fa-file-upload"/>}
                        bg={useColorModeValue('gray.100', 'gray.700')}>
                    Upload files
                </Button>
                <FormField multiple
                           type="file"
                           ref={fileInputField}
                           accept=".jpg,.png,.jpeg"
                           onChange={handleNewFileUpload}
                />
            </FileUploadContainer>
            <SimpleGrid spacing={'40px'}
                        w={[350, 450, 550]}
                        justifyItems={'center'}
                        columns={[1, 2, 3, 3, 3]}>
                {Object.keys(files).map((fileName, index) => {
                    let file = files[fileName];
                    let isImageFile = file.type.split("/")[0] === "image";
                    return (
                        <PreviewContainer key={fileName + '_' + index}>
                            <Box>
                                {isImageFile && (
                                    <Image rounded={'6px'}
                                           alt={`file preview ${index}`}
                                           src={URL.createObjectURL(file)}/>
                                )}
                                <FileMetaData isImageFile={isImageFile}>
                                    <Text fontSize={'15px'}>{file.name}</Text>
                                    <Box>
                                        <Text>{convertBytesToKB(file.size)} kb</Text>
                                        <IconButton size='xs'
                                                    colorScheme='blue'
                                                    icon={<DeleteIcon/>}
                                                    aria-label='Search database'
                                                    onClick={() => removeFile(fileName)}/>
                                    </Box>
                                </FileMetaData>
                            </Box>
                        </PreviewContainer>
                    );
                })}
            </SimpleGrid>
        </Flex>
    );
};

export default FilesUploadModule;

const FileUploadContainer = styled.section`
  position: relative;
  margin: 25px 0 15px;
  border: 2px dotted;
  transition: border 0.2s ease-in-out;
  padding: 35px 20px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 550px;

  @media only screen and (max-width: 767px) {
    width: 450px;
  }

  @media only screen and (max-width: 479px) {
    width: 350px;
  }

  :hover {
    border: 2px solid #858585;
  }
`;

const FormField = styled.input`
  font-size: 18px;
  display: block;
  width: 100%;
  border: none;
  text-transform: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;

  &:focus {
    outline: none;
  }
`;

const FileMetaData = styled.div`
  display: ${(props) => (props.isImageFile ? "none" : "flex")};
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  background-color: rgba(5, 5, 5, 0.55);

  div {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
  }
`;

const PreviewContainer = styled.section`
  padding: 0.25rem;
  width: 200px;
  height: 120px;
  border-radius: 6px;
  box-sizing: border-box;
  margin-bottom: 25px;

  &:hover {
    opacity: 0.55;

    ${FileMetaData} {
      display: flex;
    }
  }

  & > div:first-of-type {
    height: 100%;
    position: relative;
    display: flex;
    justify-content: center;
  }
`;
