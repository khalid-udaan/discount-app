import React, { useCallback, useState } from "react";
import { useForm, useField } from "@shopify/react-form";
import {
  Button,
  ChoiceList,
  Stack,
  TextField,
  Modal,
  List,
  Checkbox,
} from "@shopify/polaris";

const ProductList = ["KJJDJJD", "kkksd", "ghjkl", "dfhjk"];

const CollectionList = ["KJJDJJD", "kkksd", "ghjkl", "dfhjk"];

const ApplyTo = () => {
  const [selected, setSelected] = useState(["Specific collections"]);
  // const [input, setInput] = useState("");
  // const [collections, setCollections]=useState([]);
  const [Products, setProducts] = useState(ProductList);
  const [active, setActive] = useState(true);
  const [checked, setChecked] = useState(false);
  const [value, setValue] = useState('Jaded Pixel');

  // console.log(Products);
 const{
  fields:{
    configuration,
  }
 }=useForm({
  fields:{
    configuration: {
      // Add quantity and percentage configuration
      value:useField(""),
    },
  }
 })

  const handleChangeBox = useCallback(
    (newChecked) => setChecked(newChecked),
    []);

  const handleChangeModel = useCallback(() => setActive(!active), [active]);
  const activator = <Button onClick={handleChangeModel}>Browser</Button>;

  //  console.log(input, "input box for apply")
  // console.log(selected, "selected");
  const handleInputChange = (event) => {
    setInput(event.target.value);
    // console.log(event.target.value);
  };

  const handleChange = useCallback((value) => setSelected(value), []);

  const handlerSearch = (e) => {
    if (e.target.value === "") {
      setProducts(ProductList);
      return;
    }

    const FilterProductList = Products.filter(
      (item) => item.toLowerCase().indexOf(e.target.Value.toLowerCase()) !== -1
    );
    setProducts(FilterProductList);
  };

  // console.log(FilterProductList);

  return (
    <>
      <ChoiceList
        title="APPLY TO"
        choices={[
          { label: "Specific collectionsn", value: "Specific collections" },
          { label: "Specific products", value: "Specific products" },
        ]}
        selected={selected}
        onChange={handleChange}
      />
      <Stack>
        <TextField type="text" 
        
        {...configuration.value}
        
        />
        <div>
          <Modal
            activator={activator}
            open={active}
            onClose={handleChangeModel}
            title="Add collections"
            primaryAction={{
              content: "Add",
              onAction: handleChangeModel,
            }}
            secondaryActions={[
              {
                content: "Cencle",
                onAction: handleChangeModel,
              },
            ]}
          >
            <TextField type="text" onChange={handlerSearch} 
            {...configuration.value}
            />
            <Modal.Section>
              <Stack>
                <List>
                  {
                    Products.map((item, index) => {
                      return (
                        <List.Item key={index}>
                          <Checkbox
                            label={item}
                            checked={checked}
                            onChange={handleChangeBox}
                          />
                        </List.Item>
                      );
                    })}
                </List>
              </Stack>
            </Modal.Section>
          </Modal>
        </div>
      </Stack>
    </>
  );
};

export default ApplyTo;