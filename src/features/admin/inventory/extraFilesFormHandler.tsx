import {
  Box,
  Typography,
  Grid,
  Button,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Link,
} from "@mui/material";
import { Product } from "../../../app/models/product";

interface Props {
  product?: Product;
  cancel: () => void;
}

export default function ExtraFilesFormHandler({ product, cancel }: Props) {
  console.log("product", product);
  return (
    <DialogContent>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        مشاهده فایل های محصول {product?.name}
      </Typography>
      <Grid container spacing={3} minHeight={300}>
        {product?.mediaList.map((M) => (
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar
                  variant="square"
                  sx={{ width: 128, height: 128 }}
                  src={M.mediaFileName}
                ></Avatar>
              </ListItemAvatar>
              <ListItemText>
                <Link href={M.mediaFileName} target="_blank">
                  {M.mediaFileName}
                </Link>
              </ListItemText>
            </ListItem>
          </List>
        ))}
      </Grid>
      <Box display="flex" justifyContent="flex-start" sx={{ mt: 3 }}>
        <Button onClick={cancel} variant="contained" color="inherit">
          انصراف
        </Button>
      </Box>
    </DialogContent>
  );
}
