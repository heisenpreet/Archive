import React, { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

const ItemTypes = {
  CATEGORY: "CATEGORY",
  SUBCATEGORY: "SUBCATEGORY",
  PRODUCT: "PRODUCT",
};

const App = () => {
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

  const [data, setData] = useState(initialData);
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
      const categoryIndex = fromIndex[0];
      const subcategoryIndex = fromIndex[1];
      const productIndex = fromIndex[2];

      const product =
        updatedData[categoryIndex].subcategory[subcategoryIndex].products[
          productIndex
        ];

      if (toIndex[0] === "newCategory") {
        updatedData[categoryIndex].subcategory[
          subcategoryIndex
        ].products.splice(productIndex, 1);
        updatedData[toIndex[1]].subcategory[toIndex[2]].products.push(product);
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
      <div
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
        <h2>{category.categoryName}</h2>
        <button
          onClick={() => {
            handleAddSubcategory(index, subCatRef.current.value);
          }}
        >
          Add Subcategory
        </button>
        <input
          type="text"
          // value={newSubcategoryName}
          // onChange={(e) => {
          //   e.stopPropagation();
          //   setNewSubcategoryName(e.target.value);
          // }}
          ref={subCatRef}
          placeholder="Enter subcategory name"
        />
        <Subcategories category={category} index={index} moveItem={moveItem} />
      </div>
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
      <div
        ref={(node) => drag(drop(node))}
        style={{
          padding: "10px",
          margin: "5px 0",
          border: "1px dashed black",
          backgroundColor: isDragging
            ? "lightblue"
            : isOver
            ? "lightyellow"
            : "white",
        }}
      >
        <h3>{subcategory.name}</h3>
        <Products
          categoryIndex={categoryIndex}
          subcategoryIndex={subcategoryIndex}
          products={subcategory.products}
          moveItem={moveItem}
        />
      </div>
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

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <button onClick={handleAddCategory}>Add Category</button>
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Enter category name"
        />
        {data.map((category, index) => (
          <Category
            key={index}
            category={category}
            index={index}
            moveItem={moveItem}
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default App;
