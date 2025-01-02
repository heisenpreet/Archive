import React, { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {
  Box,
  Button,
  Card,
  Grid,
  Grid2,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { Add } from "@mui/icons-material";

const ItemTypes = {
  CATEGORY: "CATEGORY",
  SUBCATEGORY: "SUBCATEGORY",
  PRODUCT: "PRODUCT",
  PRODUCT_LIST_ITEM: "PRODUCT_LIST_ITEM",
};
const listProducts = [
  { name: "apple", id: 1 },
  { name: "table", id: 2 },
  { name: "car", id: 3 },
  { name: "book", id: 4 },
  { name: "chair", id: 5 },
  { name: "house", id: 6 },
  { name: "dog", id: 7 },
  { name: "computer", id: 8 },
  { name: "phone", id: 9 },
  { name: "tree", id: 10 },
  { name: "bottle", id: 11 },
  { name: "pen", id: 12 },
  { name: "lamp", id: 13 },
  { name: "door", id: 14 },
  { name: "watch", id: 15 },
  { name: "keyboard", id: 16 },
  { name: "mouse", id: 17 },
  { name: "sofa", id: 18 },
  { name: "camera", id: 19 },
  { name: "plant", id: 20 },
];

const initialData = [
  {
    categoryName: "categoryName",
    isSubCategory: true,
    subcategory: [
      {
        name: "test",
        products: [
          { name: "card", id: "1" },
          { name: "test2332", id: "2" },
          { name: "test2332", id: "5" },
          { name: "test23", id: "6" },
          { name: "test1", id: "8" },
        ],
      },
      {
        categoryName: "test",
        isSubCategory: false,
        products: [
          { name: "34334", id: "3" },
          { name: "23ew", id: "4" },
        ],
      },
    ],
  },
  {
    categoryName: "categoryName2",
    isSubCategory: true,
    subcategory: [
      {
        name: "test2",
        products: [
          { name: "...", id: "1" },
          { name: "2323", id: "2" },
        ],
      },
      {
        categoryName: "test22",
        isSubCategory: false,
        products: [
          { name: "34334", id: "3" },
          { name: "23ew", id: "4" },
        ],
      },
    ],
  },
];
const App = () => {
  const [data, setData] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");

  const moveItem = (fromIndex, toIndex, type) => {
    let updatedData = [...data];

    if (type === ItemTypes.CATEGORY) {
      const [movedCategory] = updatedData.splice(fromIndex, 1);
      updatedData.splice(toIndex, 0, movedCategory);
    } else if (type === ItemTypes.SUBCATEGORY) {
      const categoryIndex = fromIndex[0];
      const subcategoryIndex = fromIndex[1];
      if (toIndex[0] === "newCategory") {
        const [movedSubcategory] = updatedData[
          categoryIndex
        ].subcategory.splice(subcategoryIndex, 1);
        updatedData[toIndex[1]].subcategory.push(movedSubcategory);
      } else {
        const targetCategoryIndex = toIndex[0];
        const targetSubcategoryIndex = toIndex[1];
        const [movedSubcategory] = updatedData[
          categoryIndex
        ].subcategory.splice(subcategoryIndex, 1);
        updatedData[targetCategoryIndex].subcategory.splice(
          targetSubcategoryIndex,
          0,
          movedSubcategory
        );
      }
    } else if (type === ItemTypes.PRODUCT) {
      if (fromIndex.length === 1) {
        const product = listProducts.filter(
          (item) => item.id === fromIndex[0]
        )[0];
        console.log(product);
        if (toIndex[0] === "newCategory") {
          updatedData[toIndex[1]].subcategory[toIndex[2]].products.push(
            product
          );
        } else {
          const targetCategoryIndex = toIndex[0];
          const targetSubcategoryIndex = toIndex[1];
          const targetProductIndex = toIndex[2];

          // updatedData[categoryIndex].subcategory[
          //   subcategoryIndex
          // ].products.splice(productIndex, 1);

          updatedData[targetCategoryIndex].subcategory[
            targetSubcategoryIndex
          ].products.splice(targetProductIndex, 0, product);
        }
      } else {
        const categoryIndex = fromIndex[0];
        const subcategoryIndex = fromIndex[1];
        const productIndex = fromIndex[2];

        const product =
          updatedData[categoryIndex]?.subcategory[subcategoryIndex]?.products[
            productIndex
          ];

        if (toIndex[0] === "newCategory") {
          updatedData[categoryIndex].subcategory[
            subcategoryIndex
          ].products.splice(productIndex, 1);
          updatedData[toIndex[1]].subcategory[toIndex[2]].products.push(
            product
          );
        } else {
          const targetCategoryIndex = toIndex[0];
          const targetSubcategoryIndex = toIndex[1];
          const targetProductIndex = toIndex[2];
          updatedData[categoryIndex].subcategory[
            subcategoryIndex
          ].products.splice(productIndex, 1);
          updatedData[targetCategoryIndex].subcategory[
            targetSubcategoryIndex
          ].products.splice(targetProductIndex, 0, product);
        }
      }
    }

    setData(updatedData);
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim() === "") return;
    const newCategory = {
      categoryName: newCategoryName,
      isSubCategory: true,
      subcategory: [],
    };
    setData([...data, newCategory]);
    setNewCategoryName("");
    setOpen(false);
  };

  const handleAddSubcategory = (categoryIndex, newSubcategoryName) => {
    if (newSubcategoryName.trim() === "") return;
    const newSubcategory = {
      name: newSubcategoryName,
      products: [],
    };
    const updatedData = [...data];
    updatedData[categoryIndex].subcategory.push(newSubcategory);
    setData(updatedData);
    setNewSubcategoryName("");
  };

  const Category = ({ category, index }) => {
    const [open, setOpen] = useState(false);
    const subCatRef = useRef();
    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.CATEGORY,
      item: { index, fromIndex: index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [{ isOver }, drop] = useDrop({
      accept: ItemTypes.CATEGORY,
      drop: (item) => {
        if (item.index !== index) {
          moveItem(item.index, index, ItemTypes.CATEGORY);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

    if (!category || !category.categoryName) {
      return null;
    }

    return (
      <details
        open=""
        ref={(node) => drag(drop(node))}
        style={{
          padding: "10px",
          margin: "5px 0",
          border: "1px solid black",
          backgroundColor: isDragging
            ? "lightgreen"
            : isOver
            ? "lightyellow"
            : "lightgrey",
        }}
      >
        <summary>
          {category.categoryName}{" "}
          <Button
            onClick={() => setOpen(true)}
            variant="contained"
            endIcon={<Add />}
            size="small"
            sx={{ marginLeft: "2rem", textWrap: "nowrap" }}
          >
            Add SubCategory
          </Button>
          {/* //add sub category modal */}
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography>Add Category</Typography>
              <form>
                <TextField
                  fullWidth
                  type="text"
                  inputRef={subCatRef}
                  label="Enter subcategory name"
                  margin="normal"
                />
                <Button
                  onClick={() => {
                    handleAddSubcategory(index, subCatRef.current.value);
                  }}
                  variant="contained"
                  endIcon={<Add />}
                >
                  Submit
                </Button>
              </form>
            </Box>
          </Modal>
        </summary>

        <Subcategories category={category} index={index} moveItem={moveItem} />
      </details>
    );
  };

  const Subcategory = ({
    categoryIndex,
    subcategory,
    subcategoryIndex,
    moveItem,
  }) => {
    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.SUBCATEGORY,
      item: { fromIndex: [categoryIndex, subcategoryIndex] },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [{ isOver }, drop] = useDrop({
      accept: ItemTypes.SUBCATEGORY,
      drop: (item) =>
        moveItem(
          item.fromIndex,
          [categoryIndex, subcategoryIndex],
          ItemTypes.SUBCATEGORY
        ),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

    if (!subcategory || !subcategory.name) {
      return null;
    }

    return (
      <details
        style={{
          padding: "10px",
          margin: "5px 1rem",
          border: "1px dashed black",
          backgroundColor: isDragging
            ? "lightblue"
            : isOver
            ? "lightyellow"
            : "white",
        }}
        ref={(node) => drag(drop(node))}
      >
        <summary>{subcategory.name}</summary>
        <Products
          categoryIndex={categoryIndex}
          subcategoryIndex={subcategoryIndex}
          products={subcategory.products}
          moveItem={moveItem}
        />
      </details>
    );
  };

  const Subcategories = ({ category, index, moveItem }) => {
    return category.subcategory.map((subcategory, subcategoryIndex) => (
      <Subcategory
        key={subcategoryIndex}
        categoryIndex={index}
        subcategory={subcategory}
        subcategoryIndex={subcategoryIndex}
        moveItem={moveItem}
      />
    ));
  };

  const Product = ({
    categoryIndex,
    subcategoryIndex,
    product,
    productIndex,
    moveItem,
  }) => {
    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.PRODUCT,
      item: { fromIndex: [categoryIndex, subcategoryIndex, productIndex] },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [{ isOver }, drop] = useDrop({
      accept: ItemTypes.PRODUCT,
      drop: (item) =>
        moveItem(
          item.fromIndex,
          [categoryIndex, subcategoryIndex, productIndex],
          ItemTypes.PRODUCT
        ),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

    if (!product || !product.name) {
      return (
        <div
          ref={(node) => drag(drop(node))}
          style={{
            padding: "5px",
            margin: "5px 0",
            border: "1px solid grey",
            backgroundColor: isDragging
              ? "lightcoral"
              : isOver
              ? "lightyellow"
              : "lightgray",
          }}
        >
          4r
        </div>
      );
    }

    return (
      <div
        ref={(node) => drag(drop(node))}
        style={{
          padding: "5px",
          margin: "5px 0",
          border: "1px solid grey",
          backgroundColor: isDragging
            ? "lightcoral"
            : isOver
            ? "lightyellow"
            : "lightgray",
        }}
      >
        {product.name}
      </div>
    );
  };

  const Products = ({
    categoryIndex,
    subcategoryIndex,
    products,
    moveItem,
  }) => {
    if (!products.length) {
      const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.PRODUCT,
        item: { fromIndex: [categoryIndex, subcategoryIndex, 0] },
        collect: (monitor) => ({
          isDragging: monitor.isDragging(),
        }),
      });

      const [{ isOver }, drop] = useDrop({
        accept: ItemTypes.PRODUCT,
        drop: (item) =>
          moveItem(
            item.fromIndex,
            [categoryIndex, subcategoryIndex, 0],
            ItemTypes.PRODUCT
          ),
        collect: (monitor) => ({
          isOver: monitor.isOver(),
        }),
      });
      return (
        <div
          ref={(node) => drag(drop(node))}
          style={{
            padding: "5px",
            margin: "5px 0",
            border: "1px solid grey",
            backgroundColor: isDragging
              ? "lightcoral"
              : isOver
              ? "lightyellow"
              : "lightgray",
          }}
        >
          No products available
        </div>
      );
    }
    return products.map((product, productIndex) => (
      <Product
        key={product?.id}
        categoryIndex={categoryIndex}
        subcategoryIndex={subcategoryIndex}
        product={product}
        productIndex={productIndex}
        moveItem={moveItem}
      />
    ));
  };

  const ListProducts = ({ product }) => {
    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.PRODUCT,
      item: { fromIndex: [product.id] },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [{ isOver }, drop] = useDrop({
      accept: ItemTypes.PRODUCT,
      drop: (item) => {},
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

    return (
      <ListItem
        style={{
          padding: "5px",
          margin: "5px 0",
          border: "1px solid grey",
          backgroundColor: isDragging
            ? "lightcoral"
            : isOver
            ? "lightyellow"
            : "lightgray",
        }}
        ref={(node) => drag(drop(node))}
      >
        <ListItemText primary={product.name} />
      </ListItem>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Grid2
        container
        padding={2}
        bgcolor={blue[50]}
        height={"97vh"}
        width={"98vw"}
        spacing={2}
        overflow={"hidden"}
      >
        <Box bgcolor={"white"} borderRadius={"0.5rem"} padding={2}>
          <Typography textAlign="center"> Products List</Typography>
          <TextField fullWidth label="Search" size="small" margin="normal" />
          <List
            sx={{
              width: "100%",
              minWidth: 200,
              bgcolor: "background.paper",
              position: "relative",
              overflow: "auto",
              maxHeight: "75vh",
              overflowY: "scroll",
              "& ul": { padding: 0 },
            }}
          >
            {listProducts.map((product) => (
              <ListProducts key={product.id} product={product} />
            ))}
          </List>
        </Box>

        <Grid2 width="75vw">
          <Button
            onClick={() => setOpen(true)}
            variant="contained"
            endIcon={<Add />}
            sx={{ marginLeft: "83.5%", textWrap: "nowrap" }}
          >
            Add Category
          </Button>
          {/* //add category modal */}
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography>Add Category</Typography>
              <form>
                <TextField
                  fullWidth
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  label="Enter category name"
                  margin="normal"
                />
                <Button
                  onClick={handleAddCategory}
                  variant="contained"
                  endIcon={<Add />}
                >
                  Submit
                </Button>
              </form>
            </Box>
          </Modal>

          {data.map((category, index) => (
            <Category
              key={index}
              category={category}
              index={index}
              moveItem={moveItem}
            />
          ))}
        </Grid2>
      </Grid2>
    </DndProvider>
  );
};

export default App;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
