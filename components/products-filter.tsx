"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"

export default function ProductsFilter() {
  const [priceRange, setPriceRange] = useState([500, 10000])

  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={["category", "price", "color", "size", "style"]}>
        <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="category-tops" />
                <Label htmlFor="category-tops">Tops</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="category-tshirts" />
                <Label htmlFor="category-tshirts">T-Shirts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="category-blouses" />
                <Label htmlFor="category-blouses">Blouses</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="category-dresses" />
                <Label htmlFor="category-dresses">Dresses</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="category-jeans" />
                <Label htmlFor="category-jeans">Jeans</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="category-skirts" />
                <Label htmlFor="category-skirts">Skirts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="category-jackets" />
                <Label htmlFor="category-jackets">Jackets</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                defaultValue={[500, 10000]}
                min={500}
                max={20000}
                step={500}
                value={priceRange}
                onValueChange={setPriceRange}
                className="my-6"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">₹{priceRange[0].toLocaleString()}</span>
                <span className="text-sm">₹{priceRange[1].toLocaleString()}</span>
              </div>
              <div className="space-y-2 mt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="price-under1000" />
                  <Label htmlFor="price-under1000">Under ₹1,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="price-1000to3000" />
                  <Label htmlFor="price-1000to3000">₹1,000 - ₹3,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="price-3000to5000" />
                  <Label htmlFor="price-3000to5000">₹3,000 - ₹5,000</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="price-over5000" />
                  <Label htmlFor="price-over5000">Over ₹5,000</Label>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="color">
          <AccordionTrigger>Color</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              <div className="w-8 h-8 rounded-full bg-black border border-gray-300 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-white border border-gray-300 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-red-600 border border-gray-300 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-pink-500 border border-gray-300 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-blue-600 border border-gray-300 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-green-600 border border-gray-300 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-yellow-500 border border-gray-300 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-purple-600 border border-gray-300 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-gray-400 border border-gray-300 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-orange-500 border border-gray-300 cursor-pointer"></div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="size">
          <AccordionTrigger>Size</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="size-xs" />
                <Label htmlFor="size-xs">XS</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="size-s" />
                <Label htmlFor="size-s">S</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="size-m" />
                <Label htmlFor="size-m">M</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="size-l" />
                <Label htmlFor="size-l">L</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="size-xl" />
                <Label htmlFor="size-xl">XL</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="size-xxl" />
                <Label htmlFor="size-xxl">XXL</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="style">
          <AccordionTrigger>Style</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="style-casual" />
                <Label htmlFor="style-casual">Casual</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="style-formal" />
                <Label htmlFor="style-formal">Formal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="style-party" />
                <Label htmlFor="style-party">Party</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="style-workwear" />
                <Label htmlFor="style-workwear">Workwear</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="style-vacation" />
                <Label htmlFor="style-vacation">Vacation</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
