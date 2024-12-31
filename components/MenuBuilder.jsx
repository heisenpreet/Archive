import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

// Define types for drag-and-drop items
const ItemTypes = {
  CATEGORY: 'CATEGORY',
  SUBCATEGORY: 'SUBCATEGORY',
  PRODUCT: 'PRODUCT',
};

const initialData = [
  {
    categoryName: 'categoryName',
    isSubCategory: true,
    subcategory: [
      { name: 'test', products: [{ name: '...', id: '1' }, { name: '2323', id: '2' }] },
      { categoryName: 'test', isSubCategory: false, products: [{ name: '34334', id: '3' }, { name: '23ew', id: '4' }] }
    ]
  },
  {
    categoryName: 'categoryName2',
    isSubCategory: true,
    subcategory: [
      { name: 'test2', products: [{ name: '...', id: '1' }, { name: '2323', id: '2' }] },
      { categoryName: 'test22', isSubCategory: false, products: [{ name: '34334', id: '3' }, { name: '23ew', id: '4' }] }
    ]
  }
];
const DnDMenuBuilder = () => {

  const [data, setData] = useState(initialData);

  // Handle drag end
  const moveItem = (fromIndex, toIndex, type) => {
    let updatedData = [...data];
    if (type === ItemTypes.CATEGORY) {
      const [movedCategory] = updatedData.splice(fromIndex, 1);
      updatedData.splice(toIndex, 0, movedCategory);
    } else if (type === ItemTypes.SUBCATEGORY) {
      const categoryIndex = fromIndex[0];
      const subcategoryIndex = fromIndex[1];
      const [movedSubcategory] = updatedData[categoryIndex].subcategory.splice(subcategoryIndex, 1);
      updatedData[categoryIndex].subcategory.splice(toIndex, 0, movedSubcategory);
    } else if (type === ItemTypes.PRODUCT) {
      const categoryIndex = fromIndex[0];
      const subcategoryIndex = fromIndex[1];
      const productIndex = fromIndex[2];
      const [movedProduct] = updatedData[categoryIndex].subcategory[subcategoryIndex].products.splice(productIndex, 1);
      updatedData[categoryIndex].subcategory[subcategoryIndex].products.splice(toIndex, 0, movedProduct);
    }
    setData(updatedData);
  };

  // Category component with drag-and-drop
  const Category = ({ category, index }) => {
    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.CATEGORY,
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    return (
      <div
        ref={drag}
        style={{
          padding: '10px',
          margin: '5px 0',
          border: '1px solid black',
          backgroundColor: isDragging ? 'lightgreen' : 'lightgrey',
        }}
      >
        <h2>{category.categoryName}</h2>
        <Subcategories category={category} index={index} moveItem={moveItem} />
      </div>
    );
  };

  // Subcategory component with drag-and-drop
  const Subcategories = ({ category, index, moveItem }) => {
    return category.subcategory.map((subcategory, subIndex) => (
      <Subcategory
        key={subIndex}
        categoryIndex={index}
        subcategory={subcategory}
        subcategoryIndex={subIndex}
        moveItem={moveItem}
      />
    ));
  };

  // Subcategory component with drag-and-drop
  const Subcategory = ({ categoryIndex, subcategory, subcategoryIndex, moveItem }) => {
    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.SUBCATEGORY,
      item: { fromIndex: [categoryIndex, subcategoryIndex] },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [{ isOver }, drop] = useDrop({
      accept: ItemTypes.SUBCATEGORY,
      drop: (item) => moveItem(item.fromIndex, [categoryIndex, subcategoryIndex], ItemTypes.SUBCATEGORY),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

    return (
      <div
        ref={(node) => drag(drop(node))}
        style={{
          padding: '10px',
          margin: '5px 0',
          border: '1px dashed black',
          backgroundColor: isDragging ? 'lightblue' : isOver ? 'lightyellow' : 'white',
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

  // Product component with drag-and-drop
  const Products = ({ categoryIndex, subcategoryIndex, products, moveItem }) => {
    return products.map((product, productIndex) => (
      <Product
        key={product.id}
        categoryIndex={categoryIndex}
        subcategoryIndex={subcategoryIndex}
        product={product}
        productIndex={productIndex}
        moveItem={moveItem}
      />
    ));
  };

  // Product component with drag-and-drop
  const Product = ({ categoryIndex, subcategoryIndex, product, productIndex, moveItem }) => {
    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.PRODUCT,
      item: { fromIndex: [categoryIndex, subcategoryIndex, productIndex] },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    return (
      <div
        ref={drag}
        style={{
          padding: '5px',
          margin: '5px 0',
          border: '1px solid grey',
          backgroundColor: isDragging ? 'lightcoral' : 'lightgray',
        }}
      >
        {product.name}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h1>Drag and Drop Categories, Subcategories, and Products</h1>
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

export default DnDMenuBuilder;
