/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/react-in-jsx-scope */
import Head from 'next/head';
import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
// @ts-ignore
import shortid from 'shortid';
import {
  Box,
  HStack,
  Pressable,
  Icon,
  Text,
  ProgressBar,
  AddIcon,
  Hoverable,
  Checkbox,
  Button,
  Input,
  CheckIcon,
  TrashIcon,
} from '@/components';
import { defaultTodos, getCompletedTasks, getDay } from '@/utils';

// import { Box, Text } from "../components";

const Meta = () => {
  return (
    <Head>
      <title>Create Gluestack App</title>
      <meta name="description" content="Generated by node glue add web" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Todo = () => {
  const [item, setItem] = useState('');
  const [todos, setTodos] = useState(defaultTodos);
  const [swipedItemId, setSwipedItemId] = useState(null);
  const [lastItemSelected, setLastItemSelected] = useState(false);

  const addTodo = () => {
    const lastTodo = todos[todos.length - 1];

    if (lastTodo.task !== '') {
      setTodos([
        ...todos,
        {
          id: shortid.generate(),
          task: '',
          completed: false,
        },
      ]);
      setItem('');
      setLastItemSelected(false);
    }
  };

  return (
    <Box m="$10">
      <Box px="$6">
        <Text color="$dark900" fontWeight="$bold" fontSize="$xl">
          {getDay()}
        </Text>
        <ProgressBar
          completedTasks={getCompletedTasks(
            todos,
            item != '' && lastItemSelected
          )}
          totalTasks={item !== '' ? todos.length + 1 : todos.length}
        />
      </Box>

      {todos.map((todo, index) => (
        <SwipeableContainer
          key={index}
          todo={todo}
          todos={todos}
          setTodos={setTodos}
          swipedItemId={swipedItemId}
          setSwipedItemId={setSwipedItemId}
        />
      ))}

      <Pressable
        mb="$32"
        px="$6"
        sx={{
          '@md': {
            mb: 0,
          },
        }}
        onPress={() => {
          addTodo();
          // setTimeout(() => {
          //   inputRef.current.focus();
          // }, 100);
        }}
      >
        <HStack alignItems="center" mt="$4">
          <Icon as={AddIcon} color="$secondary600" />
          <Text ml="$2" fontSize="$sm" color="$textDark50">
            Add Task
          </Text>
        </HStack>
      </Pressable>
    </Box>
  );
};

const SwipeableContainer = ({ todo, todos, setTodos, swipedItemId }: any) => {
  const [isOpen] = useState(false);
  const [lastTap, setLastTap] = useState(null);
  const [editItem, setEditItem] = useState(todo.task);
  const [editItemId, setEditItemId] = useState(null);
  const swipeableRef: any = useRef(null);
  const inputRef: any = useRef(null);

  useEffect(() => {
    if (swipedItemId !== null && swipedItemId !== todo.id) {
      swipeableRef.current.close();
    }
  });

  const handleDelete = (id: any) => {
    const updatedTodos = todos.filter((todo: any) => todo.id !== id);
    setTodos(updatedTodos);
  };
  const toggleCheckbox = (id: any) => {
    const updatedTodos = todos.map((todo: any) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };
  const handleEdit = (id: any) => {
    setEditItemId(null);
    if (editItem !== '') {
      const updatedTodos = todos.map((todo: any) =>
        todo.id === id ? { ...todo, task: editItem } : todo
      );
      setTodos(updatedTodos);
    } else {
      setEditItem(todo.task);
    }
  };
  const handleDoubleTap = () => {
    const now = Date.now();
    if (!lastTap) {
      // @ts-ignore
      setLastTap(now);
    } else {
      if (now - lastTap < 700) {
        setEditItemId(todo.id);
        setTimeout(() => {
          inputRef.current.focus();
        }, 100);
      }
      setLastTap(null);
    }
  };

  return (
    <Hoverable
      px="$6"
      py="$2"
      minHeight={38}
      flexDirection="row"
      bg={isOpen ? '$backgroundDark700' : '$backgroundDark900'}
      key={todo.id}
      alignItems="center"
      focusable={false}
      onPress={handleDoubleTap}
    >
      <Checkbox
        aria-label={todo.id}
        isChecked={todo.completed}
        value={todo.task}
        onChange={() => toggleCheckbox(todo.id)}
        size="sm"
        w="$full"
        borderColor="transparent"
      >
        <Checkbox.Indicator>
          <Checkbox.Icon color="$backgroundDark900" as={CheckIcon} />
        </Checkbox.Indicator>
        <Input
          sx={{
            ':focus': {
              _web: {
                boxShadow: 'none',
              },
            },
          }}
          borderWidth="$0"
          w="$full"
          h={22}
        >
          <Input.Input
            pl="$2"
            editable={!isOpen && editItemId === todo.id}
            value={editItem}
            color="$textDark50"
            fontSize="$sm"
            fontWeight="$normal"
            textDecorationLine={todo.completed ? 'line-through' : 'none'}
            onChangeText={(val) => setEditItem(val)}
            onSubmitEditing={() => handleEdit(todo.id)}
            onBlur={() => handleEdit(todo.id)}
            autoComplete="off"
            ref={inputRef}
          />
        </Input>
      </Checkbox>
      <Button
        zIndex={9999}
        h="$full"
        p="$3"
        bg="$error900"
        borderRadius="$none"
        onPress={() => handleDelete(todo.id)}
        focusable={false}
      >
        <Icon as={TrashIcon} name="trash" size={18} />
      </Button>
    </Hoverable>
  );
};
const Home: NextPage = () => {
  return (
    <div>
      <Meta />
      <Todo />
      {/* <Container /> */}
    </div>
  );
};

export default Home;
