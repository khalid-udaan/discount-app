import { useForm, useField } from "@shopify/react-form";
import React, { useCallback, useState } from "react";
import {
  Button,
  ChoiceList,
  Stack,
  TextField,
  Modal,
  List,
  Checkbox
} from "@shopify/polaris";
const ProductList = ["Apple", "Shirt", "Pen"];

const Collections = ["Bout", "Aroma", "Lenovo", "Oppo", "Realme"];

const ApplyTo = () => {
  const [selected, setSelected] = useState(["COLLECTIONS"]);
  const [Products, setProducts] = useState([]);
  const [active, setActive] = useState(false);
  const [checked, setChecked] = useState(false);
  const [collections, SetCollection] = useState(Collections);
  const [change, setChange] = useState(true);
  const [loading, setLoading]=useState(false);
  const [add, setAdd] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState({
    CollectionsList: [],
    response: [],
  });

  // const handleChangeBox =(e)=> {
  // }


  const handleChangeModel = useCallback(() => setActive(!active), [active]);
  const activator = <Button onClick={handleChangeModel}>Browser</Button>;

  const handleChange = value => {
    if (value[0] == "COLLECTIONS") {
      setSelected(value);
      setChange(true);
      SetCollection(Collections);
    } 
    else 
    {
      setSelected(value);
      setChange(false);
      setProducts(ProductList);
    }
  };

  const handlerSearch = e => {
    if (e.target.value === "") {
      setProducts(ProductList);
      return;
    } else {
      const FilterProductList = Products.filter(item =>
        item.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setProducts(FilterProductList);
    }
  };

  const handlerSearchSecond = e => {
    if (e.target.value === "") {
      SetCollection(Collections);
      return;
    } else {
      const FilterProductList = Collections.filter(item =>
        item.toLowerCase().includes(e.target.value.toLowerCase())
      );
      SetCollection(FilterProductList);
    }
  };

  const handleChangeCheckbox = (e) => {
    const { value, checked } = e.target;
    const { CollectionsList } = selectedCollection;
    console.log(`${value} is ${checked}`);
    if (checked) {
    setChecked(checked);
      setSelectedCollection({
        CollectionsList: [...CollectionsList, value],
      });
    }

    else {
    setChecked(checked);
      setSelectedCollection({
        CollectionsList: CollectionsList.filter((e) => e !== value),
      });
    }
  };
  return (
    <>
      <ChoiceList
        title="APPLY TO"
        choices={[
          { label: "Specific collections", value: "COLLECTIONS" },
          { label: "Specific products", value: "PRODUCTS" },
        ]}
        selected={selected}
        onChange={handleChange}
      />
      <Stack>
        <TextField type="text" onChange={handlerSearch} value={""} />
        <div>
          {change ? (
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
                  content: "Cancel",
                  onAction: handleChangeModel,
                },
              ]}
            >
              <input
                type="text"
                onChange={handlerSearchSecond}
                style={{ width: "90%", padding: "10px", marginLeft: "30px" }}
              />
              <Modal.Section>
                <Stack>
                  <form>
                    <List>
                      {collections &&
                        collections.map((item, index) => {
                          return (
                            <List.Item key={index}>
                              <input 
                                type="checkbox"
                                value={item}
                                checked={checked}
                                onChange={handleChangeCheckbox}
                              />
                              <label>{item}</label>
                            </List.Item>
                          );
                        })}
                    </List>
                  </form>
                </Stack>
              </Modal.Section>
            </Modal>
          ) : (
            <Modal
              activator={activator}
              open={active}
              onClose={handleChangeModel}
              title="Add Products"
              primaryAction={{
                content: "Add",
                onAction: handleChangeModel,
              }}
              secondaryActions={[
                {
                  content: "Cancel",
                  onAction: handleChangeModel,
                },
              ]}
            >
              <input
                type="text"
                onChange={handlerSearch}
                style={{ width: "90%", padding: "10px", marginLeft: "30px" }}
              />
              <Modal.Section>
                <Stack>
                  <form>
                    <List>
                      {Products &&
                        Products.map((item, index) => {
                          return (
                            <List.Item key={index}>
                              <Checkbox
                                label={item}
                                value={item}
                                name={item}
                                checked={checked}
                                onChange={handleChangeBox}
                              />
                            </List.Item>
                          );
                        })}
                    </List>
                  </form>
                </Stack>
              </Modal.Section>
            </Modal>
          )}
        </div>
      </Stack>
    </>
  );
};
export default ApplyTo;
